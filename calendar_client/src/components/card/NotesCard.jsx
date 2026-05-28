import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Chip,
  Button,
} from '@mui/material'

function NotesCard({ item, handleEdit, handleDelete, title }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6">{title}</Typography>
      <Stack spacing={1}>
        {item.map((note) => (
          <Card
            sx={{
              backgroundColor:
                note.type === 'plan' ? '#fbf1d4'
                : note.type === 'wish' ? '#defddf'
                : '#fae0ff',
            }}
            key={note._id}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Chip
                  size="small"
                  label={
                    note.type === 'plan' ? 'План'
                    : note.type === 'wish' ?
                      'Пожелание'
                    : 'Идея'
                  }
                  sx={{
                    backgroundColor:
                      note.type === 'plan' ? 'plan.main'
                      : note.type === 'wish' ? 'wish.main'
                      : 'idea.main',
                  }}
                  color={'primary'}
                />
                <Typography variant="subtitle1" sx={{ ml: 1 }}>
                  {note.title}
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {note.content}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={() => handleEdit(note)}>
                  Редактировать
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(note._id)}
                >
                  Удалить
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}

export default NotesCard
